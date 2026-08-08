# Artificially Passing Spec Tests in WebLab (Part 1)
[WebLab](https://eip.pages.ewi.tudelft.nl/eip-website/weblab.html) is a learning environment for computer science related courses. It is developed and maintained by and for the Delft University of Technology. The platform allows students among many other things to write and execute code in _any_ language (Java, Python, Rust, SQL, everything). This is perfect for accessible coding and keeping track of student results. It is for example also used for exams, where WebLab is available on computers in a computer room with restricted permissions (sometimes an IDE is also available, but the code must be submitted in WebLab). The way the code is usually graded is through Specification Tests (Spec Tests). These are simply tests (using some testing framework) that verify the submitted code. Of course, the bodies of these tests are hidden to the student. This should ensure that the student cannot hardcode the test inputs and artificially pass the tests. However, as it turns out, this can be bypassed.

## The environment
WebLab is web-based, so it can be accessed from anywhere. To safely execute the code, Docker is used. This ensures no harmful actions can be done to the backend through malicious code submissions. It furthermore isolates (containerises) the submission from submissions from other students.

In a simple assignment, there are two windows the student has access to: the Solution window, and the student's own Test window. The Solution window is where a certain task should be implemented, and the Test window is available to help the student debug their code. The code in the Test window is usually ungraded; only the code from the Solution window matters. To check the code against the student's own tests, there is a Your Test button which will execute the tests. To actually grade the code though, there is a third, hidden, Spec Test window. Its code is not visible to the student, but the test results are. For example, if the Spec Test has four checks, the only output visible to the student would be `<passed tests>/4`. Crucially the standard output is also hidden, which is not the case when the Your Test button is clicked. All this ensures no information from the Spec Tests can be leaked.

Conveniently, all output from the student's own tests _is_ available. Furthermore, it is likely the implementation of executing the Spec Test is similar to the execution of the student's own tests. So while the Spec Tests are a black box, the custom tests can be used to enlighten it.

## Abusing Java
This writeup pertains to Java assignments. Java is a wonderful language. Its huge standard library can do almost anything you can possibly wish for. And, sometimes with some exceptions, all of it is available to the student. On top of that, modern Java is used in WebLab!

Since Java 9, the Stack Walker API is available. This allows for viewing the stack frames in the current stack. For example, to collect the last ten stack frames to a list, you can do:

```java
List<StackFrame> stackFrames = StackWalker.getInstance().walk(s -> s
    .limit(10)
    .collect(Collectors.toList()));
```

Since presumably the Spec Tests directly call our code, the second stack frame should be the test function frame from the Spec Tests. We can verify this against our own tests. Printing the first ten frames, we see:

```
weblab.Solution.solve(Solution.java:32)
weblab.TestSuite.test(TestSuite.java:16)
org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:727)
org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)
org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:131)
nl.tudelft.weblab.runner.BaseTestRunner.interceptTestMethod(BaseTestRunner.java:55)
org.junit.jupiter.engine.execution.InterceptingExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(InterceptingExecutableInvoker.java:103)
org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.lambda$invoke$0(InterceptingExecutableInvoker.java:93)
org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:106)
org.junit.jupiter.engine.extension.SameThreadTimeoutInvocation.proceed(SameThreadTimeoutInvocation.java:45)
```

Indeed, the second frame is from our testing class. The next logical step would be to see if the `StackFrame` instance contains the expected output for the assertion. This is the case if the test looks something like this:

```java
@Test
public void test() {
    int expectedValue = 100;
    assertEquals(expectedValue, Solution.solve(50));
}
```

Here, the frame should have the data of the local variable `expectedValue`. While the `StackFrame` interface does not directly expose this information, a hidden implementation does. This is `java.lang.LiveStackFrameInfo`. To make sure our instance is of this type, we need to make sure `StackWalker.ExtendedOption.LOCALS_AND_OPERANDS` is passed as option to the creation of the `StackWalker`. The method `LiveStackFrame#getStackWalker` achieves this, but unfortunately `LiveStackFrame` is package-private. This is where it gets a bit complex; Java has some security in place to prevent accessing implementation code through reflection. However, Java being as wonderful as it is, this can be bypassed using `MethodHandles.Lookup.IMPL_LOOKUP`. Method handles are references to things like fields, methods and constructors. `IMPL_LOOKUP` in particular is a lookup that bypasses most access restrictions. Perhaps expectedly though, accessing this field is a problem of its own. To not get too wound up with the details, below is the necessary code presented bare:

```java
private static final class UnsafeUtils {
    private UnsafeUtils() {
    }

    private static final Unsafe UNSAFE = make(() -> {
        try {
            Field unsafeField = Unsafe.class.getDeclaredField("theUnsafe");
            unsafeField.setAccessible(true);
            return (Unsafe) unsafeField.get(null);
        } catch (Exception e) {
            return null;
        }
    });

    private static final MethodHandles.Lookup IMPL_LOOKUP = make(() -> {
        try {
            if (UNSAFE == null) {
                return null;
            }
            Field implLookupField = MethodHandles.Lookup.class.getDeclaredField("IMPL_LOOKUP");
            return (MethodHandles.Lookup) UNSAFE.getObject(UNSAFE.staticFieldBase(implLookupField), UNSAFE.staticFieldOffset(implLookupField));
        } catch (Exception e) {
            return null;
        }
    });

    private static <T> T make(Supplier<T> supplier) {
        return supplier.get();
    }
}
```

`Unsafe`, as the name implies, allows us to perform unsafe operations. In this case it allows us to access the `IMPL_LOOKUP` field. Then over in the function that should be implemented for the assignment we do:

```java
MethodHandle getStackWalkerHandle = UnsafeUtils.IMPL_LOOKUP.findStatic(Class.forName("java.lang.LiveStackFrame"), "getStackWalker", MethodType.methodType(StackWalker.class));
StackWalker stackWalker = (StackWalker) getStackWalkerHandle.invoke();
StackWalker.StackFrame testFrame = stackWalker.walk(s -> s
    .skip(1)
    .findFirst().orElseThrow());
```

Using this, we can access the variable `LiveStackFrameInfo.locals`, which contains the array of local variables. The type of this variable is `Object[]`, which is an array that consists of `PrimitiveSlot`s holding the raw contents of a primitive type, or references to objects in the heap. Here we will choose the case when the type is a primitive type, but the code can be modified to support references too. Depending on the architecture of the host system, the `PrimitiveSlot` is either of type `PrimitiveSlot32` (32-bit systems) or of type `PrimitiveSlot64` (64-bit systems). For WebLab, the host system is a 64-bit system. With access to the local variables, we can now forcefully pass the tests.

## Passing the tests
With the required setup, we shall now demonstrate how to pass the hidden tests. Suppose a Spec Test is as follows:

```java
@Test
public void testMedian() {
    double expectedValue = 2.5;
    double[] input = {4, 2, 1, 3};
    assertEquals(expectedValue, Solution.solve(input), 1e-3);
}
```

In the stack frame of the `testMedian` method, the local variable array will contain a `PrimitiveSlot64` containing the expected value, and a reference to the input array. It also contains a reference to `this` and another primitive slot, but these are not important to us. Since we are looking for a variable of type `double`, we will search for `PrimitiveSlot` variables. The below code does this:

```java
MethodHandle localsHandle = UnsafeUtils.IMPL_LOOKUP.findGetter(Class.forName("java.lang.LiveStackFrameInfo"), "locals", Object[].class);
Object[] locals = (Object[]) localsHandle.invoke(testFrame);
Class<?> primitiveSlotClass = Class.forName("java.lang.LiveStackFrame$PrimitiveSlot");
// WebLab runs on a 64-bit system
MethodHandle longValueHandle = UnsafeUtils.IMPL_LOOKUP.findVirtual(primitiveSlotClass, "longValue", MethodType.methodType(long.class));
for (Object local : locals) {
    if (local == null) {
        continue;
    }
    if (!primitiveSlotClass.isAssignableFrom(local.getClass())) {
        continue;
    }
    long value = (long) longValueHandle.invoke(local);
    if (value == 0) {
        continue;
    }
    return Double.longBitsToDouble(value);
}
```

And that's it, the test now passes! Notice that the input variable `input` is never used in the code. And yes, it works on WebLab.

## Limitations
The code in the implementation assumes the local variable for the expected return value is present in the stack frame of the Spec Test method. This is not always the case. In particular, the following test would not be passed by our code:

```java
@Test
public void testMedian() {
    double[] input = {4, 2, 1, 3};
    assertEquals(2.5, Solution.solve(input), 1e-3);
}
```

In this case, the expected value `2.5` is present in the stack frame of the `assertEquals` call. However, this frame is not accessible from our code; it is simply not in the stack. To overcome this, see Part 2...

## Appendix A: Full Code
Tests:

```java
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

public class StackWalkerBypassTest {
    @Test
    public void example() {
        double expectedOutput = 2.5;
        double[] input = {4, 2, 1, 3};
        assertEquals(expectedOutput, StackWalkerBypass.solve(input), 1e-3);
    }

    @Test
    public void oneItem() {
        double expectedOutput = 42;
        double[] input = {42};
        assertEquals(expectedOutput, StackWalkerBypass.solve(input), 1e-3);
    }

    @Test
    public void smallOdd() {
        double expectedOutput = 3;
        double[] input = {1, 3, 5, 4, 2};
        assertEquals(expectedOutput, StackWalkerBypass.solve(input), 1e-3);
    }
}
```

Implementation:

```java
import sun.misc.*;

import java.lang.invoke.*;
import java.lang.reflect.*;
import java.util.function.*;

public class StackWalkerBypass {
    public static double solve(double[] input) {
        try {
            MethodHandle getStackWalkerHandle = UnsafeUtils.IMPL_LOOKUP.findStatic(Class.forName("java.lang.LiveStackFrame"), "getStackWalker", MethodType.methodType(StackWalker.class));
            StackWalker stackWalker = (StackWalker) getStackWalkerHandle.invoke();
            StackWalker.StackFrame testFrame = stackWalker.walk(s -> s
                .skip(1)
                .findFirst().orElseThrow());

            MethodHandle localsHandle = UnsafeUtils.IMPL_LOOKUP.findGetter(Class.forName("java.lang.LiveStackFrameInfo"), "locals", Object[].class);
            Object[] locals = (Object[]) localsHandle.invoke(testFrame);
            Class<?> primitiveSlotClass = Class.forName("java.lang.LiveStackFrame$PrimitiveSlot");
            // WebLab runs on a 64-bit system
            MethodHandle longValueHandle = UnsafeUtils.IMPL_LOOKUP.findVirtual(primitiveSlotClass, "longValue", MethodType.methodType(long.class));
            for (Object local : locals) {
                if (local == null) {
                    continue;
                }
                if (!primitiveSlotClass.isAssignableFrom(local.getClass())) {
                    continue;
                }
                long value = (long) longValueHandle.invoke(local);
                if (value == 0) {
                    continue;
                }
                double solution = Double.longBitsToDouble(value);
                System.out.println("Solution: " + solution);
                return solution;
            }
        } catch (Throwable t) {
            throw new AssertionError(t);
        }
        throw new AssertionError();
    }

    private static final class UnsafeUtils {
        private UnsafeUtils() {
        }

        private static final Unsafe UNSAFE = make(() -> {
            try {
                Field unsafeField = Unsafe.class.getDeclaredField("theUnsafe");
                unsafeField.setAccessible(true);
                return (Unsafe) unsafeField.get(null);
            } catch (Exception e) {
                return null;
            }
        });

        private static final MethodHandles.Lookup IMPL_LOOKUP = make(() -> {
            try {
                if (UNSAFE == null) {
                    return null;
                }
                Field implLookupField = MethodHandles.Lookup.class.getDeclaredField("IMPL_LOOKUP");
                return (MethodHandles.Lookup) UNSAFE.getObject(UNSAFE.staticFieldBase(implLookupField), UNSAFE.staticFieldOffset(implLookupField));
            } catch (Exception e) {
                return null;
            }
        });

        private static <T> T make(Supplier<T> supplier) {
            return supplier.get();
        }
    }
}
```

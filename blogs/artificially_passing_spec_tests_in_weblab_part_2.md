# Artificially Passing Spec Tests in WebLab (Part 2)
It is highly recommended to read Part 1 first!

---

In Part 1 we saw how we could use the `StackWalker` to extract local variables from the hidden test function. However, if the test did not declare the expected output as local variable, it cannot be extracted. That is, the below method could not be artificially passed:

```java
@Test
public void testMedian() {
    double[] input = {4, 2, 1, 3};
    assertEquals(2.5, Solution.solve(input), 1e-3);
}
```

In this part we will show how to use artificially pass this test regardless.

## ByteBuddy
It turns out, probably for technical reasons, that ByteBuddy is on the classpath. This can be verified by printing the classpath to the standard output by running the custom tests. We can do this as follows:

```java
String classPath = System.getProperty("java.class.path");
String[] paths = classPath.split(System.getProperty("path.separator"));
for (String path : paths) {
    System.out.println(path);
}
```

For WebLab, the classpath consists of the following:

```
./src/main/java/
./src/test/java/
/user_libs/junit-jupiter-api-5.9.3.jar
/user_libs/junit-jupiter-params-5.9.3.jar
/user_libs/assertj-core-3.24.2.jar
/user_libs/junit-platform-commons-1.9.3.jar
/user_libs/runner-2.6.1.jar
/user_libs/junit-jupiter-5.9.3.jar
/user_libs/junit-platform-console-standalone-1.9.3.jar
/user_libs/junit-jupiter-engine-5.9.3.jar
/user_libs/junit-platform-engine-1.9.3.jar
/user_libs/opentest4j-1.2.0.jar
/user_libs/junit-platform-launcher-1.9.3.jar
/user_libs/byte-buddy-1.12.21.jar
```

Indeed, we find that ByteBuddy 1.12.21 is present. For those who do not know what ByteBuddy is:

> Byte Buddy is a code generation and manipulation library for creating and modifying Java classes during the runtime of a Java application and without the help of a compiler. Other than the code generation utilities that ship with the Java Class Library, Byte Buddy allows the creation of arbitrary classes and is not limited to implementing interfaces for the creation of runtime proxies. Furthermore, Byte Buddy offers a convenient API for changing classes either manually, using a Java agent or during a build.
> 
> _https://bytebuddy.net/_

In particular, ByteBuddy bundles a part of [ASM](https://asm.ow2.io/), which is a more low-level Java bytecode manipulation and analysis framework. Notice that in the classpath, we also find the directory `./src/test/java/`, which contains the Spec Tests. This means we can simply use ASM to analyse the bytecode of the Spec Test class! Given that the custom tests reside in the package `weblab`, this is probably the case for the Spec Tests as well. We can thus find the Spec Tests class file as follows:

```java
File testFile = Arrays.stream(paths)
    .filter(path -> path.contains("test"))
    .limit(1)
    .map(File::new)
    .filter(File::isDirectory)
    .flatMap(testPathDirectory -> Arrays.stream(testPathDirectory.listFiles()))
    .filter(file -> file.isDirectory() && file.getName().equals("weblab"))
    .limit(1)
    .flatMap(weblabPackage -> Arrays.stream(weblabPackage.listFiles()))
    .filter(file -> file.isFile() && file.getName().endsWith(".class"))
    .findAny()
    .orElseThrow();
```

Next we can simply obtain the bytes of the class by opening a `FileInputStream` and calling `FileInputStream#readAllBytes`. To start analysing the class file, we create a `ClassReader` object:

```java
ClassReader reader = new ClassReader(bytes);
```

However, when we do so, we get the following error message (this actually depends on the course):

```
java.lang.IllegalArgumentException: Unsupported class file major version 67
```

Here major version 67 denotes Java 23. This happens because ByteBuddy 1.12.21 only officially supports up to major version 64 (Java 20). Not to worry, though; the class file format has barely changed since Java 17. We can therefore somewhat safely just do:

```java
bytes[7] = 0x40 // spoof Java 20
```

Now that instantiating the `ClassReader` succeeds, we can start analysing the class and its test methods. 

## Analysing the test method
We can analyse the bytecode of the class through `ClassReader#accept(ClassVisitor)`. A `ClassVisitor` "visits" a class and can perform certain operations on the class during its visit. In our case, we want to inspect test methods, so we override the method `ClassVisitor#visitMethod`. This method returns a `MethodVisitor`, which is similar to a `ClassVisitor` but for methods. But how do we know which test method to inspect? After all, there are usually several Spec Tests, but to artificially pass a given one we need to inspect that specific one's bytecode. We can use a technique from Part 1 to solve this issue. That is, using the `StackWalker`, we can figure out the name of the test method that is currently being checked. Then in the `visitMethod` method, we ensure to only visit the method that has the same name as the target method. We can obtain the target method's name as follows:

```java
StackWalker.StackFrame testFrame = StackWalker.getInstance().walk(s -> s
    .skip(1)
    .findFirst().orElseThrow());
String methodName = testFrame.getMethodName();
```

Then in `visitMethod` we can do something like:

```java
@Override
public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
    if (name.equals(methodName)) {
        return methodVisitor; // our method visitor, to be implemented
    }
    return super.visitMethod(access, name, descriptor, signature, exceptions);
}
```

Here, `methodVisitor` is the `MethodVisitor` that visits our target test method. So what do we look for in this method? Recall the body of the test method:

```java
@Test
public void testMedian() {
    double[] input = {4, 2, 1, 3};
    assertEquals(2.5, Solution.solve(input), 1e-3);
}
```

We want to extract the value of the constant that is passed as first parameter to the `assertEquals` function. We should thus look for constants that are loaded in the bytecode. Now, the `assertEquals` method is usually the last method call in a test method's body. That means the target constant is loaded second to last, last being the constant `1e-3`. Note that this is an assumption, though. With the full power of ASM, there are deterministic ways to determine what constant is passed as first parameter, but this requires some API that is not bundled with ByteBuddy. For the vast majority of test methods this will work fine, though.

Constants in Java (more generally in the JVM) are loaded in various ways, depending on the type. In the `Opcodes` class, all relevant opcodes are listed, along with the method we should override to visit them. These are `visitLdcInsn`, `visitIntInsn` and `visitInsn`. Here, `ldc` stands for "load constant", and `insn` stands for "instruction". In our `MethodVisitor` we will therefore keep track of all the constants that are loaded with the opcodes. For this, we will simply create a list:

```java
List<Object> constants = new ArrayList<>();
```

The implementation of the visitor methods will then look something like:

```java
@Override
public void visitLdcInsn(Object value) {
    constants.add(value);
    super.visitLdcInsn(value);
}

@Override
public void visitIntInsn(int opcode, int operand) {
    if (opcode == Opcodes.BIPUSH || opcode == Opcodes.SIPUSH) {
        constants.add(operand);
    }
    super.visitIntInsn(opcode, operand);
}

@Override
public void visitInsn(int opcode) {
    switch (opcode) {
        case Opcodes.ACONST_NULL -> constants.add(null);
        case Opcodes.ICONST_M1 -> constants.add(-1);
        case Opcodes.ICONST_0 -> constants.add(0);
        case Opcodes.ICONST_1 -> constants.add(1);
        case Opcodes.ICONST_2 -> constants.add(2);
        case Opcodes.ICONST_3 -> constants.add(3);
        case Opcodes.ICONST_4 -> constants.add(4);
        case Opcodes.ICONST_5 -> constants.add(5);
        case Opcodes.LCONST_0 -> constants.add(0L);
        case Opcodes.LCONST_1 -> constants.add(1L);
        case Opcodes.FCONST_0 -> constants.add(0f);
        case Opcodes.FCONST_1 -> constants.add(1f);
        case Opcodes.FCONST_2 -> constants.add(2f);
        case Opcodes.DCONST_0 -> constants.add(0d);
        case Opcodes.DCONST_1 -> constants.add(1d);
    }
    super.visitInsn(opcode);
}
```

After all constants are loaded, the target assertion method is called. This is done through the opcode `INVOKESTATIC` (`assertEquals` is a static method). We can visit this invocation by overriding the method `visitMethodInsn`. To make sure it is actually the assertion, we can just check the method's package and name:

```java
if (opcode != Opcodes.INVOKESTATIC || !owner.equals("org/junit/jupiter/api/Assertions") || !name.equals("assertEquals")) {
    super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
    return;
}
```

We can additionally check the method's arity, but this will suffice. Now we can just get the second to last element of `constants` and store its value in a variable. So:

```java
expectedOutput = (double) constants.get(constants.size() - 2);
```

Finally in the implementation method we simply return this value, and we will find that the test passes! This bypass is actually much stronger than the one in Part 1, and can be modified to support much more complicated tests. It is fully dependent on ByteBuddy/ASM being present though, whereas Part 1 works without using any library at all.

## Full code:
Tests:

```java
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

public class ByteBuddyBypassTest {
    @Test
    public void example() {
        double[] input = {4, 2, 1, 3};
        assertEquals(2.5, ByteBuddyBypass.solve(input), 1e-3);
    }

    @Test
    public void oneItem() {
        double[] input = {42};
        assertEquals(42, ByteBuddyBypass.solve(input), 1e-3);
    }

    @Test
    public void smallOdd() {
        double[] input = {1, 3, 5, 4, 2};
        assertEquals(3, ByteBuddyBypass.solve(input), 1e-3);
    }
}
```

Implementation:

```java
import net.bytebuddy.jar.asm.*;

import java.io.*;
import java.util.*;

public class ByteBuddyBypass {
    public static double solve(double[] input) {
        try {
            StackWalker.StackFrame testFrame = StackWalker.getInstance().walk(s -> s
                .skip(1)
                .findFirst().orElseThrow());
            String methodName = testFrame.getMethodName();

            String classPath = System.getProperty("java.class.path");
            String[] paths = classPath.split(System.getProperty("path.separator"));
            File testFile = Arrays.stream(paths)
                .filter(path -> path.contains("test"))
                .limit(1)
                .map(File::new)
                .filter(File::isDirectory)
                .flatMap(testPathDirectory -> Arrays.stream(testPathDirectory.listFiles()))
                .filter(file -> file.isDirectory() && file.getName().equals("weblab"))
                .limit(1)
                .flatMap(weblabPackage -> Arrays.stream(weblabPackage.listFiles()))
                .filter(file -> file.isFile() && file.getName().endsWith(".class"))
                .findAny()
                .orElseThrow();

            byte[] bytes;
            try (FileInputStream fis = new FileInputStream(testFile)) {
                bytes = fis.readAllBytes();
            } catch (Throwable t) {
                throw new AssertionError(t);
            }
            bytes[7] = 0x40; // spoof Java 20, the class file format has barely changed
            ClassReader reader = new ClassReader(bytes);

            AssertEqualsVisitor methodVisitor = new AssertEqualsVisitor();
            reader.accept(new ClassVisitor(Opcodes.ASM9) {
                @Override
                public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
                    if (name.equals(methodName)) {
                        return methodVisitor;
                    }
                    return super.visitMethod(access, name, descriptor, signature, exceptions);
                }
            }, ClassReader.EXPAND_FRAMES);

            System.out.println("Solution: " + methodVisitor.expectedOutput);
            return methodVisitor.expectedOutput;
        } catch (Throwable t) {
            throw new AssertionError(t);
        }
    }

    private static class AssertEqualsVisitor extends MethodVisitor {
        private double expectedOutput;

        private final List<Object> constants = new ArrayList<>();

        public AssertEqualsVisitor() {
            super(Opcodes.ASM9);
        }

        @Override
        public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface) {
            if (opcode != Opcodes.INVOKESTATIC || !owner.equals("org/junit/jupiter/api/Assertions") || !name.equals("assertEquals")) {
                super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
                return;
            }
            expectedOutput = (double) constants.get(constants.size() - 2);
            super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
        }

        @Override
        public void visitLdcInsn(Object value) {
            constants.add(value);
            super.visitLdcInsn(value);
        }

        @Override
        public void visitIntInsn(int opcode, int operand) {
            if (opcode == Opcodes.BIPUSH || opcode == Opcodes.SIPUSH) {
                constants.add(operand);
            }
            super.visitIntInsn(opcode, operand);
        }

        @Override
        public void visitInsn(int opcode) {
            switch (opcode) {
                case Opcodes.ACONST_NULL -> constants.add(null);
                case Opcodes.ICONST_M1 -> constants.add(-1);
                case Opcodes.ICONST_0 -> constants.add(0);
                case Opcodes.ICONST_1 -> constants.add(1);
                case Opcodes.ICONST_2 -> constants.add(2);
                case Opcodes.ICONST_3 -> constants.add(3);
                case Opcodes.ICONST_4 -> constants.add(4);
                case Opcodes.ICONST_5 -> constants.add(5);
                case Opcodes.LCONST_0 -> constants.add(0L);
                case Opcodes.LCONST_1 -> constants.add(1L);
                case Opcodes.FCONST_0 -> constants.add(0f);
                case Opcodes.FCONST_1 -> constants.add(1f);
                case Opcodes.FCONST_2 -> constants.add(2f);
                case Opcodes.DCONST_0 -> constants.add(0d);
                case Opcodes.DCONST_1 -> constants.add(1d);
            }
            super.visitInsn(opcode);
        }
    }
}
```

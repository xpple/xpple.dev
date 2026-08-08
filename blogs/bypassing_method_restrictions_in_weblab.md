# Bypassing Method Restrictions in WebLab
It is recommended to read _Artificially Passing Spec Tests in WebLab (Part 1)_ first!

---

Some courses impose certain method restrictions in the development environment of WebLab. For example in a certain course, the following code 

```java
getClass().getDeclaredMethod("test");
```

will result in:

```
We could not compile the code. See the compilation errors below:
- line 1: It is not allowed to use 'getDeclaredMethod' in your code
```

Similarly, all other reflective methods are blocked. This should prevent any reflective operations from being done, but it can be bypassed!

## Bypassing the restrictions
Importantly, note that the errors one gets when trying to use a certain method are compilation errors, not runtime errors. This means that something like Java's security manager is not used (which is a good thing). So how does the check work? Well, if we write

```java
// getClass().getDeclaredMethod("test");
```

we actually get the exact same error. It seems a simple search is done for the method's name, and if found, compilation will fail. Immediately though, one's alarm bells should start ringing. It is almost never a good idea to prevent certain actions by searching for exact occurrences of the action that is to be restricted. In many cases, this can easily be bypassed. An initial idea may be to call the `getDeclaredMethod` method through reflection, but it requires reflection to get the `Method` instance of `Class#getDeclaredMethod`. To the rescue comes the method-handle API. For example, we can do:

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodHandle methodsHandle = lookup.findVirtual(Class.class, "getDeclared" + "Methods", MethodType.methodType(Method[].class));
```

However, we get the message:

```
We could not compile the code. See the compilation errors below:
- line 1: It is not allowed to use 'reflect' in your code
```

So we also cannot import the `Method` type, or any reflective type for that matter, because those reside in the package `java.lang.reflect`. Instead of doing `Method[].class`, we can perhaps use `Class.forName` to get the class instance:

```java
Class<?> methodClass = Class.forName("java.lang.refl" + "ect.Method");
MethodHandle methodsHandle = lookup.findVirtual(Class.class, "getDeclared" + "Methods", MethodType.methodType(methodClass.arrayType()));
```

Sadly, we now get the error:

```
We could not compile the code. See the compilation errors below:
- line 1: It is not allowed to use 'forName' in your code
```

Well, the only logical next step is to get a method handle for `Class.forName` as well:

```java
MethodHandle nameHandle = lookup.findStatic(Class.class, "for" + "Name", MethodType.methodType(Class.class, String.class));
```

This works. Putting it all together, we get the following code:

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodHandle nameHandle = lookup.findStatic(Class.class, "for" + "Name", MethodType.methodType(Class.class, String.class));
Class<?> methodClass = (Class<?>) nameHandle.invoke("java.lang.refl" + "ect.Method");
MethodHandle methodsHandle = lookup.findVirtual(Class.class, "getDeclared" + "Methods", MethodType.methodType(methodClass.arrayType()));
Object[] methods = (Object[]) methodsHandle.invoke(getClass());
for (Object method : methods) {
    System.out.println(method);
}
```
After this cat and mouse game, we were finally able to bypass the restrictions!

---
id: flutter-riverpod
version: 1.0.0
triggers: [riverpod, provider, state]
---

# Riverpod

State management with Riverpod 2.x and code generation.

## Setup

```yaml
dependencies:
  flutter_riverpod: ^2.4.0
  riverpod_annotation: ^2.3.0

dev_dependencies:
  riverpod_generator: ^2.3.0
  build_runner: ^2.4.0
```

## Provider Types

```dart
// Simple value
@riverpod
String greeting(GreetingRef ref) => 'Hello';

// Async data
@riverpod
Future<User> user(UserRef ref) async {
  return ref.watch(apiProvider).getUser();
}

// Notifier for mutable state
@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() => state++;
}
```

## Consumer Usage

```dart
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return Text('$count');
  }
}
```

## Async Handling

```dart
ref.watch(userProvider).when(
  data: (user) => UserCard(user),
  loading: () => const CircularProgressIndicator(),
  error: (e, st) => ErrorText(e.toString()),
);
```

## Family Providers

```dart
@riverpod
Future<Post> post(PostRef ref, int id) async {
  return ref.watch(apiProvider).getPost(id);
}

// Usage
ref.watch(postProvider(42));
```

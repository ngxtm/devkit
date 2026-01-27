---
id: flutter-bloc
version: 1.0.0
triggers: [bloc, state management, flutter bloc]
---

# BLoC Pattern

State management using flutter_bloc package.

## Structure

```
lib/
├── blocs/
│   ├── auth/
│   │   ├── auth_bloc.dart
│   │   ├── auth_event.dart
│   │   └── auth_state.dart
```

## Event Naming

Events as actions in past tense:
- `AuthLoginRequested`
- `AuthLogoutRequested`
- `UserProfileUpdated`

## State Patterns

Use sealed classes (Dart 3+):

```dart
sealed class AuthState {}

final class AuthInitial extends AuthState {}

final class AuthLoading extends AuthState {}

final class AuthAuthenticated extends AuthState {
  final User user;
  AuthAuthenticated(this.user);
}

final class AuthError extends AuthState {
  final String message;
  AuthError(this.message);
}
```

## BlocBuilder Usage

```dart
BlocBuilder<AuthBloc, AuthState>(
  builder: (context, state) => switch (state) {
    AuthInitial() => const LoginScreen(),
    AuthLoading() => const LoadingIndicator(),
    AuthAuthenticated(user: final user) => HomeScreen(user: user),
    AuthError(message: final msg) => ErrorWidget(message: msg),
  },
)
```

## Testing

```dart
blocTest<AuthBloc, AuthState>(
  'emits [AuthLoading, AuthAuthenticated] on successful login',
  build: () => AuthBloc(authRepo),
  act: (bloc) => bloc.add(AuthLoginRequested(email, password)),
  expect: () => [
    isA<AuthLoading>(),
    isA<AuthAuthenticated>(),
  ],
);
```

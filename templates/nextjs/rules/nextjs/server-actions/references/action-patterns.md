# Next.js Server Action Patterns

## Basic Actions

```tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  await db.post.create({ data: { title, content } });
  
  revalidatePath('/posts');
}

// In component
import { createPost } from './actions';

function CreatePostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

## With useActionState

```tsx
'use client';

import { useActionState } from 'react';
import { createPost } from './actions';

function CreatePostForm() {
  const [state, action, pending] = useActionState(createPost, null);
  
  return (
    <form action={action}>
      <input name="title" required />
      <textarea name="content" required />
      {state?.error && <p className="error">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}

// Action with state
'use server';

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }
  
  try {
    await db.post.create({ data: { title } });
    revalidatePath('/posts');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to create post' };
  }
}
```

## Validation with Zod

```tsx
'use server';

import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
});

export async function createPost(prevState: any, formData: FormData) {
  const validatedFields = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, content } = validatedFields.data;
  
  await db.post.create({ data: { title, content } });
  revalidatePath('/posts');
  redirect('/posts');
}
```

## Programmatic Invocation

```tsx
'use client';

import { deletePost } from './actions';

function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (confirm('Delete this post?')) {
      await deletePost(id);
    }
  }
  
  return <button onClick={handleDelete}>Delete</button>;
}

// Action
'use server';

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });
  revalidatePath('/posts');
}
```

## With useOptimistic

```tsx
'use client';

import { useOptimistic } from 'react';
import { likePost } from './actions';

function LikeButton({ postId, likes }: { postId: string; likes: number }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state) => state + 1
  );

  async function handleLike() {
    addOptimisticLike(null);
    await likePost(postId);
  }

  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes}
    </button>
  );
}
```

## File Uploads

```tsx
'use server';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file || file.size === 0) {
    return { error: 'No file provided' };
  }
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const path = `/uploads/${file.name}`;
  await writeFile(path, buffer);
  
  return { url: path };
}

// Form
<form action={uploadFile}>
  <input type="file" name="file" required />
  <button type="submit">Upload</button>
</form>
```

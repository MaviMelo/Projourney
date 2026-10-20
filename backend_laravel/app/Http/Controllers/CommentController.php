<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{


    public function index(Request $request)
    {
        $comments = Comment::with('user:id,name')
            ->when($request->course_id, fn($q, $courseId) => $q->where('course_id', $courseId))
            ->latest()
            ->get();

        return response()->json(['comments' => $comments], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'Comentário criado com sucesso.',
            'comment' => $comment->load('user:id,name'),
        ], 201);
    }

    public function show(string $id)
    {
        $comment = Comment::with('user:id,name')->findOrFail($id);
        return response()->json(['comment' => $comment], 200);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $comment->update(['content' => $request->content]);

        return response()->json([
            'message' => 'Comentário atualizado com sucesso.',
            'comment' => $comment->load('user:id,name'),
        ], 200);
    }

    public function destroy(Request $request, string $id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comentário excluído com sucesso.',
        ], 200);
    }
}

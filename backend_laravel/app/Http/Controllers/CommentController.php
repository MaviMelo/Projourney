<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
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
            'comment' => $comment,
        ], 201);
    }

    public function show($courseId)
    {
        $comments = Comment::with('user:id,name')
            ->where('course_id', $courseId)
            ->latest()
            ->get();

        return response()->json([
            'comments' => $comments,
        ], 200);
    }
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // events配列が空の場合の処理
  if (!body.events || body.events.length === 0) {
    console.error("No events found in the request body:", body);
    return NextResponse.json(
      { status: "Error", message: "Invalid request: No events" },
      { status: 400 }
    );
  }

  const replyToken = body.events[0]?.replyToken;
  const userMessage = body.events[0]?.message?.text;

  if (!replyToken || !userMessage) {
    console.error("No replyToken or userMessage found");
    return NextResponse.json(
      {
        status: "Error",
        message: "Invalid request: Missing replyToken or userMessage",
      },
      { status: 400 }
    );
  }

  let replyMessage = "";
  if (userMessage.includes("特定のワード")) {
    replyMessage = "特定のワードに対する自動返信です。";
  } else {
    replyMessage = "そのメッセージにはお答えできません。";
  }

  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [{ type: "text", text: replyMessage }],
    }),
  });

  return NextResponse.json({ status: "OK" });
}

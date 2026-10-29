
export default function InhalerCheckPage() {
  return (
    <main style={{ padding: "16px" }}>
      <h1>InhalerCheck AI</h1>
      <p>Ингаляция техникасын бағалау</p>

      <iframe
        src="https://inhalercheck-ai-demo.vercel.app/InhalerCheck_AI_iPad_Debug.html"
        title="InhalerCheck AI"
        style={{
          width: "100%",
          height: "85vh",
          border: "none",
        }}
        allow="camera; microphone"
      />
    </main>
  );
}

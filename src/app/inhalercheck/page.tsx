export default function InhalerCheckPage() {
  const url =
    "https://inhalercheck-ai-demo.vercel.app/InhalerCheck_AI_iPad_Debug.html";

  return (
    <main style={{ padding: "20px" }}>
      <h1>InhalerCheck AI</h1>
      <p>Ингаляция техникасын бағалау</p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "14px 20px",
          marginTop: "20px",
          backgroundColor: "#009EDB",
          color: "white",
          borderRadius: "12px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        InhalerCheck AI ашу
      </a>

      <iframe
        src={url}
        title="InhalerCheck AI"
        style={{
          width: "100%",
          height: "80vh",
          border: "none",
          marginTop: "20px",
        }}
        allow="camera; microphone"
      />
    </main>
  );
}

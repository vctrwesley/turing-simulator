import "./Tape.css";

interface TapeProps {
  tapeContent: string[];
  cursorPosition: number;
}

const Tape = ({ tapeContent, cursorPosition }: TapeProps) => {
  console.log("tapeContent:", tapeContent);
  console.log("cursorPosition:", cursorPosition);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      {tapeContent.length > 0 ? (
        tapeContent.map((char, index) => {
          const isCursor = index === cursorPosition;
          return (
            <div
              key={index}
              style={{
                width: "30px",
                height: "30px",
                border: "1px solid black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: isCursor ? "#0053B8" : "white",
                margin: "0 2px",
                color: isCursor ? "white" : "black",
                fontWeight: isCursor ? "bold" : "normal",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
            >
              {char}
            </div>
          );
        })
      ) : (
        <p style={{ fontSize: "16px", fontStyle: "italic", color: "#666" }}>
          A fita está vazia.
        </p>
      )}
    </div>
  );
};

export default Tape;
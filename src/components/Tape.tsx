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
        tapeContent.map((char, index) => (
          <div
            key={index}
            style={{
              width: "30px",
              height: "30px",
              border: "1px solid black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: index === cursorPosition ? "#0053B8" : "white",
              margin: "0 2px",
              color: index === cursorPosition ? "white" : "black",
            }}
          >
            {char}
          </div>
        ))
      ) : (
        <p>A fita está vazia.</p>
      )}
    </div>
  );
};

export default Tape;
import React from "react";
import { Container } from "react-bootstrap";

export default function UserComment() {
  return (
    <Container>
      {/* 置中iframe */}
      <div className="d-flex justify-content-center">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdgnrB-suR3xF8vYqUw3MIDGLD8-LZ1Xcdy_qjhKMUJyV6lUg/viewform?embedded=true"
          width="600"
          height="1800"
        >
          載入中…
        </iframe>
      </div>
    </Container>
  );
}

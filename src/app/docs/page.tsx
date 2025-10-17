"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

type SwaggerSpec = object;

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<SwaggerSpec | null>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then((data) => {
        setSpec(data);
      })
      .catch((error) => {
        console.error("Failed to fetch swagger spec:", error);
      });
  }, []);

  if (!spec) {
    return <div>Loading API Documentation...</div>;
  }

  return (
    <section className="container">
      <SwaggerUI spec={spec} />
    </section>
  );
}

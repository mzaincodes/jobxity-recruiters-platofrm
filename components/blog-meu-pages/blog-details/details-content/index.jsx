const Index = ({ blogContent }) => {
  // If no blog content is provided, show a default message
  if (!blogContent) {
    return (
      <div className="auto-container">
        <p>No blog content available.</p>
      </div>
    );
  }

  // Split the content into paragraphs
  const paragraphs = blogContent.split('\n\n').filter(para => para.trim());

  return (
    <div className="auto-container">
      {paragraphs.map((paragraph, index) => {
        const trimmedPara = paragraph.trim();
        
        // Check if paragraph contains a quote (wrapped in quotes)
        if (trimmedPara.includes('"') && trimmedPara.includes('"')) {
          const quoteMatch = trimmedPara.match(/"([^"]+)"/);
          if (quoteMatch) {
            return (
              <blockquote key={index} className="blockquote-style-one mb-5 mt-5">
                <p>"{quoteMatch[1]}"</p>
                <cite>HR Trends Report 2025</cite>
              </blockquote>
            );
          }
        }
        
        // Check if paragraph starts with a heading-like text
        if (trimmedPara.length < 100 && trimmedPara.endsWith(':')) {
          return <h4 key={index} className="mb-3">{trimmedPara}</h4>;
        }
        
        // Regular paragraph
        return <p key={index} className="mb-4">{trimmedPara}</p>;
      })}
    </div>
  );
};

export default Index;

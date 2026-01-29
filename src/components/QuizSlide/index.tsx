export default function QuizSlide({ number, question, answers, correct, children }) {
  return (
    <section>
      {number && <h2>Question {number}</h2>}
      {question && <p style={{ fontSize: '0.85em' }}>{question}</p>}
      <ol type="a" style={{ fontSize: '0.75em', listStyleType: 'lower-alpha' }}>
        {answers.map((answer, i) => (
          <li key={i} style={i === correct ? { fontWeight: 'bold' } : {}}>
            {answer}
          </li>
        ))}
      </ol>
      {children}
    </section>
  );
}
export default function SolidPrinciple({ principle }) {
  const principles = {
    S: 'Single-Responsibility Principle',
    O: 'Open-Closed Principle',
    L: 'Liskov Substitution Principle',
    I: 'Interface Segregation Principle',
    D: 'Dependency Inversion Principle'
  };

  const letters = ['S', 'O', 'L', 'I', 'D'];

  return (
    <p style={{ fontSize: '0.5em', color: '#888', marginTop: 'auto', textAlign: 'center' }}>
      {letters.map(letter => (
        <span key={letter} style={{
          fontWeight: letter === principle ? 'bold' : 'normal',
          color: letter === principle ? 'red' : 'inherit'
        }}>
          {letter}
        </span>
      ))}
      : {principles[principle]}
    </p>
  );
}

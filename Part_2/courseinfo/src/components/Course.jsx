const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ title, parts }) => (
  <>
    <h2>{title}</h2>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </>
);

const Course = ({course}) => (
  <>
    <Content title={course.name} parts={course.parts} />
    <Total sum={course.parts.reduce((acc, cur) => acc + cur.exercises, 0)} />
  </>
)

export default Course
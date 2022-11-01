function Row({ key,values }) {

  return (
    <>
      <p className="circle">{key}</p>
      <For each={values}>{(val, j) =>
        <>
          <a className="square" href={val.link} target="_blank">{val.title}</a>
          <span className="box">{val.name}</span>
        </>
      }</For>
    </>
  );
}

export default Row;

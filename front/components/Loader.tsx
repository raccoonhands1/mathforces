const Loader = ({ text }: { text: string }) => {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <div className="loader">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      {text}
    </div>
  );
};

export default Loader;

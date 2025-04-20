import Navbar from "./Navbar";

const Unauthorized = () => (
    <>
    {/* <Navbar/> */}
    <div className="text-center flex justify-center flex-col h-screen mt-20">

      <h1 className="text-4xl font-bold text-red-500">🚫data input is not allowed</h1>
      <p className="mt-4 text-lg text-gray-300">You don't have permission to view this page.</p>
    </div>
    </>
  );
  
  export default Unauthorized;
  
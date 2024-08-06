import "./Footer.css"
export default function Footer() {
  return (
    <div className="d-flex flex-column flex-sm-row justify-content-evenly align-items-center footer text-center p-2">
      <p className='m-1  fw-bold'>To-Do-List</p>
      <a href='mailto:pvrkmsbunny@gmail.com' target='_blank' className='m-1 fw-bold'>pvrkmsbunny@gmail.com</a>
    </div>
  );
}
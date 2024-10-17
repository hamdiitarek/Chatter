import logo from '../../../../../public/logo.png';

const ContactsContainer = () => {
  return (
    <div className="fixed top-0 left-0 w-[35vw] lg:w-[30vw] xl:w-[25vw] h-screen bg-slate-100 border-r-2 flex flex-col"> 
      {/* Added flex flex-col */}
      <div className="p-4"> {/* Added padding */}
        <img src={logo} alt="Logo" className="h-14 w-auto" /> {/* Added class for sizing */}
      </div>
      <div> {/* Added a container for the remaining content */}
        ContactsContainer 
      </div>
    </div>
  );
};

export default ContactsContainer;


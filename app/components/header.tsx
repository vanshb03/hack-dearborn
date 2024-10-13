import Image from "next/image";
import Logo from '../assets/logoWOBack.png';

export const Header = () => {
  const logo = () => <Image 
      src={Logo}
      className="bg-white rounded-md p-1"
        alt="Logo" 
        width={50} 
        height={50} 
      />
  return (
    <header className="m-5 bg-gradient-to-r from-purple-800 to-purple-700 shadow-lg rounded-lg p-2 pr-5 flex justify-between items-center">
        <div className="text-white font-bold text-xl flex items-center gap-3">
          {logo()}
            AiSchedular
        </div>
        
        <nav className="space-x-4">
            <a href="#" className="text-white hover:text-purple-300">Home</a>
            <a href="#" className="text-white hover:text-purple-300">Tasks</a>
            <a href="#" className="text-white hover:text-purple-300">Schedule</a>
        </nav>
    </header>
  )
}
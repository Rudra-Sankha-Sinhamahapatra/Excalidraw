import { ReactNode } from "react"

interface Icon {
    icon:ReactNode,
    onClick: ()=> void
    activated:boolean
}

export const IconButton = ({icon,onClick,activated}:Icon) => {
    return <button className={`${!activated?"text-white":"text-red-500"} cursor-pointer rounded-full border p-2 bg-black hover:bg-gray-500` } onClick={onClick}>
    {icon}
    </button>
}
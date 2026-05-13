import {useState} from "react";
import {Image, X} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerPopup = ({icon, onSelect}) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleEmojiClick = (emoji) => {
        onSelect(emoji?.imageUrl || "");
        setIsOpen(false);
    }
    return (
        <div className="flex flex-col md:flex-row items-start gap-5 mb-6 relative">
            <div
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-4 cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-emerald-50 text-emerald-600 rounded-lg shadow-sm border border-emerald-100">
                    {icon ? (
                        <img src={icon} alt="Icon" className="w-12 h-12" />
                    ): (
                        <Image />
                    )}

                </div>
                <p className="font-medium text-gray-700">{icon ? "Change Icon" : "Pick Icon"}</p>
            </div>

            {isOpen && (
                <div className="absolute top-14 left-0 z-50 shadow-2xl rounded-lg bg-white border border-gray-200">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-3 -right-3 z-50 cursor-pointer shadow-md hover:bg-gray-50 text-gray-600">
                        <X size={16} />
                    </button>
                    <div className="overflow-hidden rounded-lg">
                        <EmojiPicker
                            open={isOpen}
                            onEmojiClick={handleEmojiClick}
                            width={300}
                            height={350}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default EmojiPickerPopup;
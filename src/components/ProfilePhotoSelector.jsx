import { useRef, useState } from "react";
import { User, Upload, Trash } from "lucide-react";


const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const prevview = URL.createObjectURL(file);
            setPreviewUrl(prevview);
        }
    }

    const handleRemoveImage = (e) => {
        e.preventDefault();
        setImage(null);
        setPreviewUrl(null);
    }

    const onChooseFile = (e) => {
        e.preventDefault();
        inputRef.current?.click();
    }



    return (

        <div className=" flex justify-center mb-6">
            <input type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!image ? (
                /* No Image Selected: Shows placeholder and Upload button */
                <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
                    <User className="text-purple-500" size={35} />

                    <button
                        type="button"
                        onClick={onChooseFile}
                        className="w-8 h-8 flex items-center justify-center bg-purple-400 text-white rounded-full absolute -bottom-1 -right-1 hover:bg-purple-700 transition">
                        <Upload size={15} />
                    </button>
                </div>
            ) : (
                /* Image Selected: Shows Preview and Remove button */
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="profile photo"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <button

                        onClick={handleRemoveImage}
                        className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full absolute -bottom-1 -right-1 hover:bg-purple-700 transition">
                        <Trash size={15} />
                    </button>
                </div>
            )}
        </div>

    )
}

export default ProfilePhotoSelector;
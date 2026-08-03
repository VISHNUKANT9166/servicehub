import { useState } from "react";
import AuthInput from "../Auth/AuthInput";
import toast from "react-hot-toast";

function ProfileForm() {

    const [formData, setFormData] = useState({
        fullName: "Vishnukant Yadav",
        email: "vishnukant@gmail.com",
        phone: "9876543210",
        address: "Greater Noida",
        city: "Greater Noida",
        state: "Uttar Pradesh",
        pincode: "201310",
    });

    const [errors, setErrors] = useState({});
    const [profileImage, setProfileImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone Number is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        toast.success("Profile updated successfully!");
        console.log(formData);
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>

            <div className="flex flex-col items-center mb-6">

                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-200">

                    {profileImage ? (

                        <img
                            src={URL.createObjectURL(profileImage)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />

                    ) : (

                        <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
                            {formData.fullName.charAt(0).toUpperCase()}
                        </div>

                    )}

                </div>

                <label className="mt-4 cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">

                    Upload Photo

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                    />

                </label>

            </div>

            <AuthInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                error={errors.fullName}
            />

            <AuthInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
            />

            <AuthInput
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                error={errors.phone}
            />

            <AuthInput
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                error={errors.address}
            />

            <AuthInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                error={errors.city}
            />

            <AuthInput
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
                error={errors.state}
            />

            <AuthInput
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter your pincode"
                error={errors.pincode}
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            >
                Save Changes
            </button>

        </form>
    );
}

export default ProfileForm;
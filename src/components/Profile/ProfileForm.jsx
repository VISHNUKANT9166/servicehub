import { useEffect, useState } from "react";
import AuthInput from "../Auth/AuthInput";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../services/userService";

function ProfileForm() {
    const { user, login } = useAuth();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [errors, setErrors] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load current user data into form
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                pincode: user.pincode || "",
            });
        }
    }, [user]);

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

    const handleSubmit = async (e) => {
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

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fix the highlighted errors.");
            return;
        }

        try {
            setLoading(true);

            const data = await updateUserProfile({
                ...formData,
                profileImage: "",
            });

            if (data.success) {
                // Update AuthContext with latest user
                login(data.user);

                toast.success("Profile updated successfully!");
            }

        } catch (error) {
            console.error("Profile Update Error:", error);

            const message =
                error.response?.data?.message ||
                "Failed to update profile.";

            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="space-y-5"
            onSubmit={handleSubmit}
        >

            {/* Profile Image */}
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
                            {formData.fullName
                                ? formData.fullName
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}
                        </div>
                    )}

                </div>

                <label className="mt-4 cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">

                    Upload Photo

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                            setProfileImage(e.target.files[0])
                        }
                    />

                </label>

            </div>

            {/* Full Name */}
            <AuthInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                error={errors.fullName}
            />

            {/* Email */}
            <AuthInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
            />

            {/* Phone */}
            <AuthInput
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                error={errors.phone}
            />

            {/* Address */}
            <AuthInput
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                error={errors.address}
            />

            {/* City */}
            <AuthInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                error={errors.city}
            />

            {/* State */}
            <AuthInput
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
                error={errors.state}
            />

            {/* Pincode */}
            <AuthInput
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter your pincode"
                error={errors.pincode}
            />

            {/* Save Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
            >
                {loading
                    ? "Saving Changes..."
                    : "Save Changes"}
            </button>

        </form>
    );
}

export default ProfileForm;
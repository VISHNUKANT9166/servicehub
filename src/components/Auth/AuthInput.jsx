import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function AuthInput({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
}) {

    const [showPassword, setShowPassword] = useState(false);

    return (

        <div className="mb-5">

            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                {label}
            </label>

            <div className="relative">

                <input
                    id={name}
                    name={name}
                    type={
                        type === "password"
                            ? (showPassword ? "text" : "password")
                            : type
                    }
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={
                        type === "password"
                            ? "new-password"
                            : "off"
                    }
                    className={`w-full rounded-xl border px-4 py-3 pr-12 outline-none transition ${error
                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        }`}
                />

                {
                    type === "password" && (

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-blue-600"
                        >
                            {
                                showPassword
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                            }
                        </button>

                    )
                }

            </div>

            {
                error && (

                    <p className="mt-1 text-sm text-red-500">
                        {error}
                    </p>

                )
            }

        </div>

    );

}

export default AuthInput;
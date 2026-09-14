// Middleware to restrict access based on user role
//
// Usage:
//
// router.post(
//     "/",
//     protect,
//     authorize("professional"),
//     createService
// );

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // protect middleware should run before authorize
            if (!req.userId || !req.userRole) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized.",
                });
            }

            // Check whether current user's role is allowed
            if (!allowedRoles.includes(req.userRole)) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to perform this action.",
                });
            }

            next();

        } catch (error) {
            console.error(
                "Authorization Error:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    };
};

export default authorize;
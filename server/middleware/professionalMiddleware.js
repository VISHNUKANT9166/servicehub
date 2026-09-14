const professionalOnly = (
    req,
    res,
    next
) => {

    if (req.userRole !== "professional") {
        return res.status(403).json({
            success: false,
            message:
                "Professional access required.",
        });
    }

    next();
};

export default professionalOnly;
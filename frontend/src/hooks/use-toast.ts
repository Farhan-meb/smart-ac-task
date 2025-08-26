import toast from "react-hot-toast";

export const useToast = () => {
    const showToast = (options: {
        title?: string;
        description: string;
        variant?: "default" | "destructive" | "success";
    }) => {
        const { title, description, variant = "default" } = options;

        const message = title ? `${title}: ${description}` : description;

        switch (variant) {
            case "success":
                return toast.success(message);
            case "destructive":
                return toast.error(message);
            default:
                return toast(message);
        }
    };

    return {
        toast: showToast,
    };
};

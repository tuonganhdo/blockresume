export default function LogoutButton() {
    return (
        <form 
            action="/auth/signout"
            method="POST"
        >
            <button 
                type="submit" 
                className="bg-red-500 hover:bg-red-600 text-white font-semibold pt-1.5 pb-2 px-3 rounded-md transition-colors"
            >
                Log out
            </button>
        </form>
    )
}
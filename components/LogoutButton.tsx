export default function LogoutButton() {
    return (
        <form action="/auth/signout" method="POST" className="w-full">
        <button type="submit" className="btn-danger">
          Log out
        </button>
      </form>
    )
}
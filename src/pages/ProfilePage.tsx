import AppShell from '../components/layout/AppShell'
import { ProfileIcon } from '../components/icons/ServiceIcons'

// TODO: Build the user profile/account screen when the design is ready.
// TODO: Add profile details, saved preferences, application history, and logout/settings actions.
// TODO: Connect profile data to Redux or API utilities once those are defined.
function ProfilePage() {
  return (
    <AppShell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-kwami-green-light text-kwami-green">
          <ProfileIcon active />
        </span>
        <h2 className="mb-2 text-xl font-bold text-kwami-green-dark">Your Profile</h2>
        <p className="max-w-xs text-sm text-gray-500">
          This screen is coming soon. It will show your details, saved preferences, and application
          history.
        </p>
      </div>
    </AppShell>
  )
}

export default ProfilePage

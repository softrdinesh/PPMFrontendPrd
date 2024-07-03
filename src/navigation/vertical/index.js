// ** Icon imports

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: 'mdi:home-outline',
      path: '/dashboard'
    },
    {
      title: 'Account Settings',
      icon: 'mdi:cog-outline',
      path: '/account-settings'
    },
    {
      sectionTitle: 'Pages'
    },

    {
      title: 'Auth',
      icon: 'mdi:logout',
      children: [
        {
          title: 'Login',
          path: '/login'
        }
      ]
    }
  ]
}

export default navigation

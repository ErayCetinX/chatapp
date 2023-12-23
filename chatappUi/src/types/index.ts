export type ThemeColors = 'Dark' | 'NightBlue' | 'Light';

export type getLoggedInUserDetailsType = {
  uuid: string;
  username: string;
  email: string;
  avatarUrl: string;
  deviceToken: string;
}

export type State = {
  Theme: ThemeColors;
  getLoggedInUserDetails: getLoggedInUserDetailsType;
  Device: string;
};

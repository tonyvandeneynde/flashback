import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";

export const Header = ({
  isLoggedIn,
  image,
  location,
  logout,
}: {
  isLoggedIn: boolean;
  image: string;
  logout: () => void;
  location: {
    pathname: string;
  };
}) => {
  const getButtonColor = (path: string) => {
    return location.pathname.startsWith(path) ? "primary" : "inherit";
  };

  return (
    <>
      <Button
        component={Link}
        to="/organize"
        color={getButtonColor("/organize")}
      >
        Organize
      </Button>
      {/* Uncomment when timeline is implemented */}
      {/* <Button
        component={Link}
        to="/timeline"
        color={getButtonColor("/timeline")}
      >
        Timeline
      </Button> */}
      <Button component={Link} to="/site" color={getButtonColor("/site")}>
        Site
      </Button>
      {isLoggedIn ? (
        <ProfileMenu image={image} logout={logout} />
      ) : (
        <Button component={Link} to="/login" color={getButtonColor("/login")}>
          Log In
        </Button>
      )}
    </>
  );
};

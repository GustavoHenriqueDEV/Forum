import React from "react";
import { Avatar } from "@mui/material";
import PropTypes from "prop-types";
import { getInitials } from "../../utils/helpers";

const AvatarWithInitials = React.memo(({ name, ...props }) => {
  return <Avatar {...props}>{getInitials(name)}</Avatar>;
});

AvatarWithInitials.propTypes = {
  name: PropTypes.string.isRequired,
};

export default AvatarWithInitials;

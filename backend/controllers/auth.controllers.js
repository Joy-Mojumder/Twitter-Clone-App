//^ auth controllers
// & signup function
export const signup = async (req, res) => {
  res.json({
    data: "you are signed up",
  });
};

// & login function
export const login = async (req, res) => {
  res.json({
    data: "you are logged in",
  });
};

// & logout function
export const logout = async (req, res) => {
  res.json({
    data: "you are logged out",
  });
};

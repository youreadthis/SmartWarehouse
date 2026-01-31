from authx import AuthX, AuthXConfig

config = AuthXConfig()
config.JWT_SECRET_KEY = "Real_SECRET_KEY"
config.JWT_ACCESS_COOKIE_NAME = "access_token"
config.JWT_TOKEN_LOCATION = ["cookies"]

Security = AuthX(config=config)
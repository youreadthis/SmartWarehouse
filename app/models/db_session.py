from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy_utils import create_database, database_exists
from app.models.local_setings import postgresql as settings



def get_engine(user, password, host, port, database):
    url = f'postgresql+asyncpg://{user}:{password}@{host}:{port}/{database}'
    nrurl = url.replace('+asyncpg', '')
    if not database_exists(nrurl):
        create_database(nrurl)
    engine = create_async_engine(url, pool_size=50, echo=False)
    return engine

def get_engine_from_settings():
    keys = ['pguser', 'password', 'host', 'port', 'pgdatabase']
    if not all(key in keys for key in settings):
        raise 'Not correct settings'

    return get_engine(settings['pguser'],
                      settings['password'],
                      settings['host'],
                      settings['port'],
                      settings['pgdatabase'])

def get_session():
    engine = get_engine_from_settings()
    return async_sessionmaker(engine, expire_on_commit=False)
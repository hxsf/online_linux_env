local _M = {
    redis_host = os.getenv('REDIS_HOST') or 'redis',
    redis_port = os.getenv('REDIS_PORT') or '6379',
    host_suffix = os.getenv('HOST_SUFFIX') or '.v.just-test.com'
}
return _M

import subprocess, json, time

# Read token from file
result = subprocess.run(["cat", "C:/Users/zizo-/.hostinger-token"], capture_output=True, text=True)
token = result.stdout.strip()
bearer = "Authorization: Bearer " + token

# Get current DNS
r1 = subprocess.run(
    ["curl", "-s", "-H", bearer, "https://developers.hostinger.com/api/dns/v1/zones/novapure.beauty"],
    capture_output=True, text=True, timeout=30
)
print("Current DNS:")
print(r1.stdout)

# Update DNS to Vercel
update_data = json.dumps({
    "zone": [
        {"type": "A", "name": "@", "records": [{"content": "216.198.79.1"}], "ttl": 3600},
        {"type": "CNAME", "name": "www", "records": [{"content": "cname.vercel-dns.com"}], "ttl": 3600}
    ]
})

r2 = subprocess.run(
    ["curl", "-s", "-X", "PUT", "-H", bearer, "-H", "Content-Type: application/json",
     "-d", update_data, "https://developers.hostinger.com/api/dns/v1/zones/novapure.beauty"],
    capture_output=True, text=True, timeout=30
)
print("\nUpdate result:")
print(r2.stdout)

# Verify
time.sleep(5)
r3 = subprocess.run(
    ["curl", "-s", "-H", bearer, "https://developers.hostinger.com/api/dns/v1/zones/novapure.beauty"],
    capture_output=True, text=True, timeout=30
)
print("\nVerified DNS:")
print(r3.stdout)
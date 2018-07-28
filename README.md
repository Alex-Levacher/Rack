[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/fold_left.svg?style=social)](http://bit.ly/Share-Lumie-twitter)

![Rack Logo](./images/Rack.png)

## 🤔 DESCRIPTION

Rack is a tool to help you to manage databases of your projects with ease.

✅ Import / Export
✅ AWS S3 support
✅ Setup CRON
✅ Manage BDDs in multiples environment. ( Ex: Clone your production data to your staging or development environment )

## 💾 INSTALLATION

```bash
npm install rack
```

## 🔩 HOW IT WORKS

**Rack** must be launch from a folder which contains `.rackfile.json`. The purpose of Rack it to adapt to different projects.
```bash
rack
```

``` json
{
    "path": "./backup",
    "hosts": {
        "localhost": {
            "url": "localhost:27018",
            "fileExtention": "dev",
            "username": "",
            "password": "",
            "databases": ["bdd1", "bdd2"]
        },
        "staging": {
            "url": "111.11.11.11:27018",
            "fileExtention": "sta",
            "username": "",
            "password": "",
            "databases":  ["bdd1"]
        },
        "production": {
            "url": "111.11.11.11:27018",
            "fileExtention": "prod",
            "username": "",
            "password": "",
            "databases": ["bdd1"]
        }
    }
}
```

## 🚀 ROADMAP

Here are the next features planned, let me know if you have some ideas

* Docker support

🚧 Work in progress

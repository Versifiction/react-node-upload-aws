Projet où l'on peut uploader un fichier qui sera stocké sur le service S3 AWS avec l'URL du fichier gardé dans un document MongoDB (Réalisé React / NodeJS / Express / MongoDB / AWS)

## Utilisation

- yarn pour installer les dépendances
- yarn start pour lancer le client et le serveur

L'utilisateur se rend sur une URL avec un pseudo en paramètres (exemple : http:localhost:3000/marc),
Il y uploade un fichier (2MB max et format jpeg|jpg|png|gif)
Le fichier est ensuite stocké dans un bucket S3 d'AWS, et l'URL de ce fichier est conservé dans un document MongoDB avec comme username le paramètre en URL
Si l'utilisateur revient sur la page, le fichier apparaît

1. Fazer um clone do repositório. Comando: git clone https://github.com/plsb/trab1-comp-nuvem.git
2. Entrar na pasta do projeto. Comando: cd trab1-comp-nuvem/twitter-comp-nuvem/
3. Construir a imagem da aplicação com o Dockerfile. Comando: docker build -t pelusb/trab-nuvem .
4. Executar os containers com o Docker Compose. Comando: docker-compose up -d
5. Executar o container da aplicação em modo interativo. Comando: docker exec -i -t twitter-comp-nuvem_twitter_1 /bin/bash
6. Executar o comando para criação da estrutura do banco de dados. Comando:  
7. Executar o comando: rm /var/run/apache2/apache2.pid   
8. Iniciar o servidor apache. Comando: service apache2 start
9. Acessar a aplicação em http://localhost:80
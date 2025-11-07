package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func main() {


	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		// DB 接続
		dsn := "root:password@tcp(mysql:3306)/myapp" // mysql サービス名とパスワードを確認
		db, err := sql.Open("mysql", dsn)
		if err != nil {
			log.Fatal("DB接続エラー:", err)
		}

		// 接続確認
		if err := db.Ping(); err != nil {
			log.Fatal("DB未接続:", err)
		}

		rows, err := db.Query("SELECT id, name, email FROM users where id=1")
		if err != nil {
			http.Error(w, "DBクエリエラー", 500)
			return
		}
		defer rows.Close()

		type User struct {
			ID    int
			Name  string
			Email string
		}
		var users []User
		for rows.Next() {
			var u User
			if err := rows.Scan(&u.ID, &u.Name, &u.Email); err != nil {
				http.Error(w, "DBスキャンエラー", 500)
				return
			}
			users = append(users, u)
		}

		fmt.Fprintf(w, "%+v", users)
	})

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

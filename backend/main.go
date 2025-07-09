package main

import (
	"math/rand"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type shortURL struct {
	urls    map[string]string // short -> long
	reverse map[string]string // long -> short
}

func (us *shortURL) shortURL(c *gin.Context) {
	originalURL := c.PostForm("urls")
	if originalURL == "" {
		c.JSON(http.StatusAccepted, gin.H{"error": "URL is required"})
		return
	}
	// Check if already shortened
	if short, exists := us.reverse[originalURL]; exists {
		c.JSON(http.StatusOK, gin.H{"shortURL": short})
		return
	}
	shortURL := genrateShortUrl()
	us.urls[shortURL] = originalURL
	us.reverse[originalURL] = shortURL
	c.JSON(http.StatusOK, gin.H{"shortURL": shortURL})
}

func genrateShortUrl() string {
	const charset = "abcdefghijklmnopqrstuuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	shortURL := make([]byte, 10)
	for i := range shortURL {
		shortURL[i] = charset[rand.Intn(len(charset))]
	}
	return string(shortURL)

}

func (us *shortURL) redirectURL(c *gin.Context) {
	shortURL := c.Param("shortURL")
	originalURL, ok := us.urls[shortURL]
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}
	c.Redirect(http.StatusTemporaryRedirect, originalURL)
}

func main() {
	us := &shortURL{urls: make(map[string]string), reverse: make(map[string]string)}
	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/shortURL", us.shortURL)
	router.GET("/:shortURL", us.redirectURL)
	router.Run(":8080")
}

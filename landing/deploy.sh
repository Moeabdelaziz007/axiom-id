#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    # Check if we want to deploy to Firebase or Netlify
    echo "Choose deployment option:"
    echo "1) Firebase"
    echo "2) Netlify"
    echo "3) Both"
    read -p "Enter your choice (1/2/3): " choice
    
    case $choice in
        1)
            echo "Deploying to Firebase..."
            firebase deploy --only hosting
            if [ $? -eq 0 ]; then
                echo "Firebase deployment successful!"
            else
                echo "Firebase deployment failed!"
                exit 1
            fi
            ;;
        2)
            echo "Deploying to Netlify..."
            npx netlify-cli deploy --dir=dist --prod
            if [ $? -eq 0 ]; then
                echo "Netlify deployment successful!"
            else
                echo "Netlify deployment failed!"
                exit 1
            fi
            ;;
        3)
            echo "Deploying to Firebase..."
            firebase deploy --only hosting
            if [ $? -eq 0 ]; then
                echo "Firebase deployment successful!"
            else
                echo "Firebase deployment failed!"
                exit 1
            fi
            
            echo "Deploying to Netlify..."
            npx netlify-cli deploy --dir=dist --prod
            if [ $? -eq 0 ]; then
                echo "Netlify deployment successful!"
            else
                echo "Netlify deployment failed!"
                exit 1
            fi
            ;;
        *)
            echo "Invalid choice. Deploying to Firebase by default..."
            firebase deploy --only hosting
            if [ $? -eq 0 ]; then
                echo "Firebase deployment successful!"
            else
                echo "Firebase deployment failed!"
                exit 1
            fi
            ;;
    esac
else
    echo "Build failed!"
    exit 1
fi
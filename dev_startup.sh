#!/usr/bin/env bash

NAMESPACE=ticketing
# PROJECT_DIR=ticketing
STRIPE_WEBHOOK_PORT=3000
TMUX_SESSION="micros"
PROJECT_DIR="$(dirname "$0")"
STOP_MINIKUBE=false

while getopts "q" opt;do
    case $opt in
        q)  STOP_MINIKUBE=true;;
        *)  echo "Invalid Option: $OPTARG";exit 1;;
    esac
done

start_tmux_session(){
    (cd "${PROJECT_DIR}";tmux new-session -d -s "$TMUX_SESSION")
}

handle_sigint() {
    echo "Sigint caught, cleaning up..."
    echo ""
    pkill -2 skaffold && \
        echo "Waiting for Skaffold to close\n\n"
        while [[ $(pgrep -c -i skaffold) -ne 0 ]];do
            sleep 10s
        done 
        if $STOP_MINIKUBE;then
            echo "Stopping Minikube ..."
            minikube stop
        fi
    exit
}

register_interrupt_handlers() {
    trap handle_sigint SIGINT    
}

start_minikube () {
    if [[ "$(pgrep -i --count  minikube)" != "0" ]]; then
        echo "Minikube already working, continuing with the rest"
    else
        echo "Starting minikube ..."
        minikube start 
    fi
}

main() {
    start_tmux_session
    start_minikube

    echo "Minikube started. Changing to namespace: $NAMESPACE"
    echo ""

    [[ $? == 0 ]] && \
        sleep 50s && \
        echo "Changing to namespace ${NAMESPACE}" && \
        kubectl config set-context minikube --namespace=${NAMESPACE} && \
        tmux new-window -t "${TMUX_SESSION}" -n skaffold -c "${PROJECT_DIR}" 'skaffold dev' 
        # (cd ${PROJECT_DIR}; skaffold dev ) &



    # Start the stripe service for it to call webhooks
    # stripe listen --forward-to http://localhost:3000/api/payments/stripe-webhook &>/tmp/strip.log &
    tmux new-window -t "$TMUX_SESSION" -n "stripe-listen" \
        "stripe listen --forward-to http://ticketing.local/api/payments/stripe-webhook"
    # Grab the secret programmatically
    export WHSEC=$(stripe listen --print-secret)

    #    echo "Setting port forwarding ..."
    #    echo ""
    if [[ $? -eq 0 ]];then
        ## Wait for Skaffold to load start the deployments
        sleep 1m 

        ## Port-forward NATS service
        kubectl port-forward \
            $(kubectl get pod | grep -i nats | awk -F '\\s*' '{print $1}') 4222:4222 &

        ## Port-forward stripe Payments service, and send to background
        ## kubectl port-forward svc/payments-svc 3000:$STRIPE_WEBHOOK_PORT &

        # Store as a Kubernetes Secret your pod can read
        kubectl create secret generic stripe-webhook \
            --from-literal=STRIPE_WEBHOOK_SECRET="$WHSEC" \
            --dry-run=client -o yaml | kubectl apply -f -
    fi


}

register_interrupt_handlers
main

# NOTE: The interrupt handlers are bound to this script's process, so if this process
# ends, the handlers are worth nothing. So I am using this workaround in order to keep
# this script going.
while true;do
    sleep 1m
done
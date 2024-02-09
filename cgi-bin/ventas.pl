#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use DBI;
use JSON;
use Time::Piece;
my $db_name   = 'trabajofinal';
my $db_user   = 'root';
my $db_pass   = '753159';
my $db_host   = 'localhost';
my $table     = 'ventas';
my $cgi = CGI->new;
# Manejar errores
    my $name      = $cgi->param('name');
    my $email     = $cgi->param('email');
    my $telefono  = $cgi->param('phone');
    my $direccion = $cgi->param('direccion');
    my $detalles  = $cgi->param('detalles');
    my $productos = $cgi->param('productos');
    my $clientID  = $cgi->param('clientID');
    my $paymentID = $cgi->param('paymentID');
    my $fecha_actual = localtime;
    my $fecha = $fecha_actual->strftime("%Y-%m-%d %H:%M:%S");
    my $json_data = decode_json($productos);
    my $finalPrice = 0;
    while (my ($clave, $valor) = each %$json_data) {
        $finalPrice += $valor->{amount} * $valor->{price};
    }
    my $dbh = DBI->connect("DBI:mysql:database=$db_name;host=$db_host", $db_user, $db_pass);
    my $sql  = "INSERT INTO $table (productos, date, clientID, paymentID, detalles, name, direccion, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    my $sth  = $dbh->prepare($sql);
    my $result = $sth->execute($productos, $fecha, $clientID, $paymentID, $detalles, $name, $direccion, $telefono, $email);
    $sth->finish;
    if ($result) {
        my $sql2 = "DELETE FROM carrito WHERE clientID = ?";
        my $sth2  = $dbh->prepare($sql2);
        my $result = $sth2->execute($clientID);
        $sth2->finish;
        my $sql3 = "SELECT amount FROM billing_card WHERE cardnumber = ?";
        my $sth3  = $dbh->prepare($sql3);
        $sth3->execute($paymentID);
        my $fila3 =  $sth3->fetchrow_arrayref;
        $sth3->finish;

        my $amount = $fila3->[0];
        $amount = $amount - $finalPrice;
        my $sql4 = "UPDATE billing_card SET amount = ? WHERE cardnumber = ?";
        my $sth4 = $dbh->prepare($sql4);
        my $rows_affected = $sth->execute($amount, $paymentID);
        $sth4->finish;
        if($rows_affected){
            print $cgi->header(-type => 'application/json', -status => 200);
            print '{"success": true}';
        }else{
            print $cgi->header(-type => 'application/json', -status => 500);
            print '{"success": "error al procesar el pago la venta"}';
        }
    } else {
        print $cgi->header(-type => 'application/json', -status => 500);
        print '{"success": "error al crear la venta"}';
    }
    $sth->finish;

    $dbh->disconnect;


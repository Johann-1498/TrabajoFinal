#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use CGI::Cookie;
use DBI;
use JSON;
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
    my $fecha     = time();

    my $dbh = DBI->connect("DBI:mysql:database=$db_name;host=$db_host", $db_user, $db_pass);
my $response;

eval {
    my $sql   = "INSERT INTO $table (productos, date, clientID, paymentID, detalles, name, direccion, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    my $sth   = $dbh->prepare($sql);
    my $result = $sth->execute($productos, $fecha, $clientID, $paymentID, $detalles, $name, $direccion, $telefono, $email);

    if ($result) {
        my $sql2   = "DELETE FROM carrito WHERE clientID = ?";
        my $sth2   = $dbh->prepare($sql2);
        my $result = $sth2->execute($clientID);
        $sth2->finish;
        $response = {
            success => 1,
            message => "Venta creada correctamente.",
        };
    } else {
        $response = {
            success => 0,
            error   => "Error al crear la venta: " . $sth->errstr,
        };
    }
    $sth->finish;
};

if ($@) {
    $response = {
        success => 0,
        error   => "Error interno en el servidor: $@",
    };
}

$dbh->disconnect;

print $cgi->header(-type => 'application/json', -status => 200);
print '{"success": ' . $response->{success} . ', "message": "' . $response->{message} . '", "error": "' . $response->{error} . '"}';